import { DevToolBot } from '../DevToolBot';
import { Event } from '../interface';

export default class extends Event {
    public constructor(protected readonly client: DevToolBot) {
        super(client, __filename, true);
    }

    public run(id: number): void {
        this.logger.info(`Shard: ${id} is now reconnecting.`);
    }
}