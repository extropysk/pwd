import { Challenge } from 'src/auth/interfaces/challenge.interface'

export class ChallengeDto implements Challenge {
  id: string
  k1: string
  lnurl: string
}
