import { ref } from 'vue'
import { useCards } from '@src/stores/cardsStore'
import { Card, CardAffinity, CardRarity, CardType } from './collectiveDto'
import localforage from 'localforage'

const CURRENT_VERSION = 1
const DATA_EXPIRATION_TIME = 24 * 60 * 60 * 1000 * 7 // 7 days

const DB_OPTIONS: LocalForageOptions = {
    name: 'collective-cards',
    storeName: 'cardList',
}

type DbTimestamp = {
    version: number
    date: number
}

interface SheetRow {
    c: {
        v: string | number | boolean | Date
        f?: string
    }[]
}

export const useCollectiveApi = () => {
    const isFetching = ref(false)

    const { allCards } = useCards()

    const db = localforage.createInstance(DB_OPTIONS)

    const isDataExpired = async () => {
        // check version & expiration time
        const timestampFromDB = (await db.getItem('timestamp')) as DbTimestamp
        if (!timestampFromDB) return true
        if (timestampFromDB.version !== CURRENT_VERSION) return true
        if (Date.now() - timestampFromDB.date > DATA_EXPIRATION_TIME)
            return true
    }

    const loadCardsFromDB = async () => {
        const cardsFromDB = (await db.getItem('cards')) as Card[]
        allCards.push(...cardsFromDB)
    }

    const fetchSheetData = async (): Promise<SheetRow[]> => {
        const SPREADSHEET_ID = '1GqUqHDlW3gSzasXYt8LhhzigXCduWyz_Dvz2rpXzBfM'
        const SHEET_ID = 0
        const response = await fetch(
            `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&tq&gid=${SHEET_ID}`
        )
        const text = await response.text()
        // Remove the prefix characters that cause the response to be invalid JSON
        const jsonString = text.slice(text.indexOf('{'), -2)
        const jsonData = JSON.parse(jsonString)
        return jsonData.table.rows
    }

    const saveCardsToDB = async (cards: SheetRow[]) => {
        try {
            const newCards: Card[] = []
            for (const card of cards) {
                // skip non uid cards like Doubloon
                if (!card.c[12]) continue

                const newCard = {
                    ability: card.c[7] ? (card.c[7].v as string) : '',
                    affinity: card.c[2].v
                        ? card.c[2].v === 'None'
                            ? ('Neutral' as CardAffinity)
                            : (card.c[2].v as CardAffinity)
                        : ('Neutral' as CardAffinity),
                    artist: card.c[9] ? (card.c[9].v as string) : '',
                    atk: card.c[5] ? (card.c[5].v as number) : NaN,
                    cost: card.c[4] ? (card.c[4].v as number) : NaN,
                    creator: card.c[8] ? (card.c[8].v as string) : '',
                    exclusive: card.c[17] ? (card.c[17].v as boolean) : false,
                    externals: card.c[14]
                        ? (card.c[14].v as string).split(',')
                        : [],
                    hp: card.c[6] ? (card.c[6].v as number) : NaN,
                    id: card.c[18].v as string,
                    image: card.c[15] ? (card.c[15].v as string) : '',
                    link: card.c[12] ? (card.c[12].v as string) : '',
                    name: card.c[0] ? (card.c[0].v as string) : '',
                    rarity: card.c[3].v as CardRarity,
                    realm: card.c[11] ? (card.c[11].v as string) : '',
                    release: card.c[13]
                        ? (card.c[13].v as Date)
                        : new Date('1970-01-01'),
                    state: card.c[16] ? (card.c[16].v as number) : NaN,
                    tribe: card.c[10] ? (card.c[10].v as string) : '',
                    type: card.c[1].v as CardType,
                }

                newCards.push(newCard)
            }

            allCards.push(...newCards)
            await db.setItem('cards', newCards)
        } catch (error) {
            console.error(`API: Error fetching cards!`, error)
            throw error
        } finally {
            console.log(`API: Done fetching cards!`)
        }

        await db.setItem('timestamp', {
            version: CURRENT_VERSION,
            date: new Date().getTime(),
        } as DbTimestamp)
    }

    const loadCards = async () => {
        // if cards are already loaded/-ing, don't fetch them again
        if (allCards.length || isFetching.value) return

        // if runes are not loaded, try to load them from cache if not expired
        if (!(await isDataExpired())) {
            try {
                await loadCardsFromDB()
                console.log('IndexedDB: Cards loaded from cache!')
                return
            } catch (error) {
                console.error('Error loading cards from cache!', error)
            }
        }

        // if runes are not loaded and cache is expired, fetch them from Google Sheets
        try {
            console.log('API: Fetching cards...')
            isFetching.value = true
            const cards = await fetchSheetData()
            console.log('API: Public Cards fetched!')

            await saveCardsToDB(cards)
            isFetching.value = false
        } catch (error) {
            console.error('Error fetching cards!', error)
        }
    }

    return {
        isFetching,
        loadCards,
    }
}

const getAbilityText = (card: any) => {
    let ability_text = ''
    if (card.Text.PlayAbility.Properties) {
        ability_text +=
            findProperty(card.Text.PlayAbility.Properties, 'AbilityText')
                .Expression.Value + '\n'
    }

    card.Text.Abilities.forEach((ability: any) => {
        if (ability.$type?.startsWith('Predefines.')) {
            ability_text += ability.$type.substring(11) + ' '
        }

        if (ability.Properties) {
            ability_text +=
                findProperty(ability.Properties, 'AbilityText').Expression
                    .Value + '\n'
        }
    })

    return ability_text
}

const findProperty = (parent_node: any, symbol_name: string) => {
    // const card_img = findProperty(card_data.card.Text.Properties, 'PortraitUrl').Expression.Value;
    // find correct Property index
    for (let i = 0; i < parent_node.length; i++) {
        if (parent_node[i].Symbol.Name === symbol_name) {
            return parent_node[i]
        }
    }

    return { Expression: { Value: null } }
}

const getCardLink = (card: any, externals: any) => {
    const externals_suffix = externals?.length ? '-m' : '-s'

    return (
        'https://files.collective.gg/p/cards/' +
        card.UID +
        externals_suffix +
        '.png'
    )
}

const getState = (card: any, public_cards: any) => {
    const public_card = public_cards.find(
        (public_card: any) => public_card.uid === card.UID
    )

    if (public_card) {
        return public_card.approval_state
    }

    return 9 // <- custom state
}

// ability: getAbilityText(card),
//     affinity:
// card.Text.Affinity === 'None'
//     ? 'Neutral'
//     : card.Text.Affinity,
//     artist: findProperty(card.Text.Properties, 'ArtistName')
//     .Expression.Value,
//     atk: parseInt(
//     findProperty(card.Text.Properties, 'ATK').Expression
//         .Value
// ),
//     cost: parseInt(
//     findProperty(card.Text.Properties, 'IGOCost').Expression
//         .Value
// ),
//     creator: findProperty(card.Text.Properties, 'CreatorName')
//     .Expression.Value,
//     exclusive: card.Text.AffinityExclusive,
//     hp: parseInt(
//     findProperty(card.Text.Properties, 'HP').Expression
//         .Value
// ),
//     id: card.UID,
//     image: findProperty(card.Text.Properties, 'PortraitUrl')
//     .Expression.Value,
//     link: getCardLink(card, externals),
//     name: card.name,
//     rarity: card.Text.Rarity,
//     realm: findProperty(card.Text.Properties, 'Realm')
//     .Expression.Value,
//     released: new Date(card.dtReleased).getTime() / 1000,
//     state: getState(card, public_cards),
//     tribe: findProperty(card.Text.Properties, 'TribalType')
//     .Expression.Value,
//     type: card.Text.ObjectType,
//     week: card.releaseGroup,
// }

// const fetchCardData = async (cardUid: string) => {
//     const response = await fetch(API_BASE_URL + ApiEndpoints.CARD + cardUid)
//     return await response.json()
// }

// const fetchPublicCards = async () => {
//     const response = await fetch(API_BASE_URL + ApiEndpoints.PUBLIC_CARDS)
//     const public_cards = (await response.json()).cards
//
//     // Throttle requests to a maximum of 5 requests per second
//     const limiter = new Bottleneck({
//         maxConcurrent: 100,
//         minTime: 100,
//     })
//
//     const fetchPromises = public_cards.map((card: any) => {
//         return limiter.schedule(() => fetchCardData(card.uid))
//     })
//
//     return {
//         public_cards,
//         data: await Promise.all(fetchPromises),
//     }
// }
