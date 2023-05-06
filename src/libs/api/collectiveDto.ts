export type Card = {
    ability?: string
    affinity: CardAffinity
    artist?: string
    atk?: number
    cost: number
    creator?: string
    exclusive: boolean
    externals?: string[]
    hp?: number
    id: string
    image: string
    link: string
    name: string
    rarity: CardRarity
    realm?: string
    release?: Date
    state?: number
    tribe?: string
    type: CardType
    week?: string
}

export enum CardType {
    Unit = 'Unit',
    Action = 'Action',
}

export enum CardAffinity {
    Neutral = 'Neutral',
    Strength = 'Strength',
    Mind = 'Mind',
    Spirit = 'Spirit',
}

export enum CardRarity {
    Common = 'Common',
    Uncommon = 'Uncommon',
    Rare = 'Rare',
    Legendary = 'Legendary',
    Undraftable = 'Undraftable',
}
