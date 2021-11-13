module.exports = async (client, ctx, pages, emojiList, timeout, queueLength, queueDuration) => {
    if (!ctx && !ctx.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');
    if (emojiList.length !== 2) throw new Error('Need two emojis.');

    let page = 0;
    const curPage = await ctx.sendMessage({ embeds: [pages[page].setFooter(`Page ${page + 1}/${pages.length} | ${queueLength} songs | ${queueDuration} total duration`)] });
    if (pages.length == 0) return;

    const permissions = ctx.channel.permissionsFor(client.user);
    if (!permissions.has('ADD_REACTIONS')) return;

    for (const emoji of emojiList) await curPage.react(emoji);

    const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
    const reactionCollector = curPage.createReactionCollector({ filter, time: timeout });
    reactionCollector.on('collect', (reaction, user) => {
        if (!user.bot && permissions.has('MANAGE_MESSAGES')) reaction.users.remove(user.id);
        switch (reaction.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        curPage.edit({ embeds: [pages[page].setFooter(`Page ${page + 1}/${pages.length} | ${queueLength} songs | ${queueDuration} total duration`)] });
    });

    reactionCollector.on('end', () => curPage.reactions.removeAll());
    return curPage;
};