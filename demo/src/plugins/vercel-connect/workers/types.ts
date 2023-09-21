import { Job } from "@gseller/core";

interface VercelDeploymentJobData {
    shopName: string;
    channelToken: string;
    path: string;
}

interface VercelDeploymentJob extends Job {
    data: VercelDeploymentJobData;
}

export {
    VercelDeploymentJobData,
    VercelDeploymentJob
}