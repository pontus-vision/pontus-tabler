import { NotFoundError, WebhookSubscriptionRes } from "./generated/api";
import { PontusService } from "./generated/api/resources/pontus/service/PontusService";

let webhook:WebhookSubscriptionRes | null = null

export default new PontusService({
    
    webhookGetPost:async (req, res)=> {
        if (!webhook) {
            throw new NotFoundError('there is no webhook')
        }else{
        res.send(webhook)
        }
    },
    webhookPost: async(req, res) => {
        webhook = {id: '1', ...req.body}
        res.send(webhook)
    },

})