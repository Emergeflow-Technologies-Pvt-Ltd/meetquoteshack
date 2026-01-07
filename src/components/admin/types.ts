import {
  Application,
  User,
  Document,
  Agent,
  ApplicationStatusHistory,
} from "@prisma/client"

export type ApplicationWithUser = Application & {
  user: User
  documents: Document[]
  documentKey?: string
  agent?: Agent | null
  estimatedPropertyValue?: number
  intendedPropertyAddress?: string
  applicationStatusHistory?: ApplicationStatusHistory[]
  potentialLenderIds?: string[]
  matchLenderIds?: string[]
  loaneeSelectedMatchLenderIds?: string[]
  assignmentMode?: "single" | "multi"
}

export type AgentWithUser = Agent & { user: User | null }
