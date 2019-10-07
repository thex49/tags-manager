module.exports.run = (client, message, args) => {

  function clean(text) {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(/'/g, "?" + String.fromCharCode(8203));
  }
  if (!args[0]) return;
  message.channel.send("https://ru.wikipedia.org/wiki/" + encodeURIComponent(args.join(" ")))
}
module.exports.help = {
  name: "wiki"
}