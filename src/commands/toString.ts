import { Message, MessageEmbed } from 'discord.js';
import { SystemCommandBuilder } from '../CommandBuilder';

const commandRegex = /^toString\((?<option>.+?)?\)$/u;

const helpMessage = `
__Change Embed to usual message__

Are you using your mobile or table but want to copy some text from Embed?
Here is your solution!

Reply to the embed with \`toString()\`
`;

new SystemCommandBuilder()
    .setName(commandRegex)
    .setHumanReadable('toString()')
    .setDescription('Change Embed message to usual message')
    .setFunction(toString)
    .buildAndRegister();

function toString(message: Message) {
    // const option = commandRegex.exec(message.content)?.groups?.option ?? {};
    const embed = new MessageEmbed();
    if (!message.reference) {
        return message.reply({
            embed: embed
                .setColor('RED')
                .setTitle('Missing reference')
                .setDescription(helpMessage),
            allowedMentions: { repliedUser: false },
        });
    }
    const referenced = message.channel.messages.resolve(message.reference.messageID ?? '');
    if (!referenced || !referenced.embeds.length) {
        return message.reply({
            embed: embed
                .setColor('RED')
                .setTitle('There was an error reading reference message')
                .setDescription('Sorry, there was an error reading reference message. Is message or embeds deleted? Do I have a permission to access?'),
            allowedMentions: { repliedUser: false },
        });
    }
    const textArray: string[] = [];
    for (const e of referenced.embeds) {
        if (e.title) textArray.push(e.title);
        if (e.description) textArray.push(e.description);
        for (const field of e.fields) {
            textArray.push(`${field.name}: ${field.value}`);
        }
    }
    message.reply(textArray.join('\n'), { allowedMentions: { repliedUser: false } });
}
