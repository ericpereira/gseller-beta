import gql from "graphql-tag";

export default function AdminSchema() {
    return gql`
        enum DeployType {
            vercel
            ios
            android
        }
        
        enum DeployStatus {
            created
            running
            finished
            error
        }

        type DeployNotFoundError {
            errorCode:  String
            message: String
        }
        
        type Deploy {
            id: ID!
            type: DeployType!
            active: Boolean!
            url: String
            status: DeployStatus!
            metadata: String
            channel: Channel!
        }

        union DeployResult = Deploy | DeployNotFoundError 

        extend type Query {
            getActiveDeploy(type: DeployType!): DeployResult!
        }
  `;
}
