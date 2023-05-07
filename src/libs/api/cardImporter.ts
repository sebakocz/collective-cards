import { useCards } from '@src/stores/cardsStore'
import { ref } from 'vue'
import { Card } from '@src/libs/api/collectiveDto'
import pLimit from 'p-limit'

const API_BASE_URL = 'https://server.collective.gg/api/'
enum ApiEndpoints {
    CARD = 'card/',
}

export const useCardImporter = () => {
    const cardStore = useCards()
    const isLoading = ref(false)
    const errors = ref<string[]>([])

    // ignore # -> comments
    const importCards = (deckList: string) => {
        errors.value = []
        isLoading.value = true
        const cardIdentifiers = deckList
            .split('\n')
            .filter((line) => line && !line.startsWith('#'))

        // try to find a uid in the line, then fetch from api
        // else use the line as name and search in public cards
        // example link: https://files.collective.gg/p/cards/728fa860-df5e-11ec-84d0-e3f041592924-s.png
        // example uid: 728fa860-df5e-11ec-84d0-e3f041592924
        const cardPromises = cardIdentifiers.map((line) => {
            const uid = line.match(/[a-z0-9-]{36}/)?.[0]

            if (uid) {
                return () => fetchCardByUid(uid)
            } else {
                return () => fetchCardByName(line)
            }
        })

        const limit = pLimit(10)
        // I'm too lazy right now to figure out how to type this
        // @ts-expect-error TS2345
        const limitedPromises = cardPromises.map((promise) => limit(promise))

        Promise.all(limitedPromises)
            .then((cards) => {
                // TODO: this seems hacky, would need to extend proper error handling and figure out why they are undefined in the first place
                cards = cards.filter((card) => card)
                cardStore.allCards.push(...(cards as Card[]))
            })
            .catch((error) => {
                console.error('Error fetching cards:', error)
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    const fetchCardByUid = (uid: string) => {
        return fetch(API_BASE_URL + ApiEndpoints.CARD + uid)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch card by UID: ' + uid)
                }
                return response
            })
            .then((response) => response.json())
            .then((cardJson) => {
                const { card, externals } = cardJson

                return {
                    ability: getAbilityText(card),
                    affinity:
                        card.Text.Affinity === 'None'
                            ? 'Neutral'
                            : card.Text.Affinity,
                    artist: findProperty(card.Text.Properties, 'ArtistName')
                        .Expression.Value,
                    atk: parseInt(
                        findProperty(card.Text.Properties, 'ATK').Expression
                            .Value
                    ),
                    cost: parseInt(
                        findProperty(card.Text.Properties, 'IGOCost').Expression
                            .Value
                    ),
                    creator: findProperty(card.Text.Properties, 'CreatorName')
                        .Expression.Value,
                    exclusive: card.Text.AffinityExclusive,
                    hp: parseInt(
                        findProperty(card.Text.Properties, 'HP').Expression
                            .Value
                    ),
                    id: card.UID,
                    image: findProperty(card.Text.Properties, 'PortraitUrl')
                        .Expression.Value,
                    link: getCardLink(card, externals),
                    name: card.name,
                    rarity: card.Text.Rarity,
                    realm: findProperty(card.Text.Properties, 'Realm')
                        .Expression.Value,
                    release: new Date(card.dtReleased),
                    state: 9,
                    tribe: findProperty(card.Text.Properties, 'TribalType')
                        .Expression.Value,
                    type: card.Text.ObjectType,
                    week: card.releaseGroup,
                }
            })
            .catch((error) => {
                errors.value.push(error)
            })
    }

    // just search in local cards
    const fetchCardByName = (name: string) => {
        return cardStore.allCards.find(
            (card) => card.name.toLowerCase() === name.toLowerCase()
        )
    }

    return {
        importCards,
        isLoading,
        errors,
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
