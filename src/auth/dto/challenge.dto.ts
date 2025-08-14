export interface Challenge {
  k1: string
  lnurl: string
  id: string
}

export class ChallengeDto implements Challenge {
  id: string
  k1: string
  lnurl: string
}
