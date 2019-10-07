module.exports.run = (client, message, args) => {

  function clean(text) {
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(/'/g, "?" + String.fromCharCode(8203));
  }



  const con = client.con;
  const method = args[0];
  if (!method) {
    message.channel.send(`
Доступные операции:
view
raw
edit
create
leader
delete`, {
      code: 'js'
    })
  }
  if (method === 'leader') {
    let i = 0;
    con.query(`SELECT * FROM tags ORDER BY uses DESC LIMIT 10`, (err, rows) => {
      console.log(rows)
      let tx = '';
      tx += 'Наиболее используемые теги:\n';
      rows.forEach(row => {
        tx += `[${++i}] - "${row.name}" :: ${row.uses} uses\n`
      })
      message.channel.send(tx, {
        code: 'js'
      })
    })
  }
  if (method === 'edit') {
    args.shift();
    if (!args[0]) return message.channel.send("Укажите тег для редактирования");
    let tag = args.join(" ").match(/"(.*?)"/i);
    if (!tag) return message.channel.send("Укажите имя тега в \" \" а потом опишите его");
    tag = tag[1];
    const desc = args.join(" ").slice(tag.length + 3);
    console.log(desc)
    console.log(tag)
    if (!desc) return message.channel.send("Опишите тег");
    con.query(`SELECT * FROM tags WHERE name = '${tag}'`, (err, rows) => {
      if (!rows[0]) return message.channel.send("Данного тега нет в системе, вы можете занять его");
      if (rows[0].owner !== message.author.id) return message.channel.send("Вы не являетесь владельцем данного тега");
      con.query(`UPDATE tags SET content = '${desc}' WHERE name = '${tag}'`)
      message.channel.send("Тег обновлен")
    })
  }

  if (method === 'forceedit' && message.author.id === '361951318929309707') {
    args.shift();
    if (!args[0]) return message.channel.send("Укажите тег для редактирования");
    let tag = args.join(" ").match(/"(.*?)"/i);
    if (!tag) return message.channel.send("Укажите имя тега в \" \" а потом опишите его");
    tag = tag[1];
    const desc = args.join(" ").slice(tag.length + 3);
    console.log(desc)
    console.log(tag)
    if (!desc) return message.channel.send("Опишите тег");
    con.query(`SELECT * FROM tags WHERE name = '${tag}'`, (err, rows) => {
      if (!rows[0]) return message.channel.send("Данного тега нет в системе, вы можете занять его");
      con.query(`UPDATE tags SET content = '${desc}' WHERE name = '${tag}'`)
      message.channel.send("Тег обновлен")
    })
  }
  if (method === 'forcedelete' && message.author.id === '361951318929309707') {
    args.shift();
    if (!args[0]) return message.channel.send("Укажите тег для удаления");
    let tag = args.join(" ").match(/"(.*?)"/i);
    if (!tag) return message.channel.send("Укажите имя тега в \" \"");
    tag = tag[1];
    con.query(`SELECT * FROM tags WHERE name = '${tag}'`, (err, rows) => {
      if (!rows[0]) return message.channel.send("Данного тега нет в системе, вы можете занять его");
      con.query(`DELETE FROM tags WHERE name = '${tag}'`)
      message.channel.send("Тег удален")
    })
  }
  if (method === 'view') {
    args.shift();
    const tag = args.join(" ");
    if (!tag) return message.channel.send('Укажите тег для просмотра');
    con.query(`SELECT * FROM tags WHERE name = '${tag}'`, (err, rows) => {
      if (!rows[0]) return message.channel.send("Данного тега нет в системе, вы можете занять его");
      message.channel.send(rows[0].content)
      con.query(`UPDATE tags SET uses = ${rows[0].uses + 1} WHERE name = '${tag}'`)
    })
  }
  if (method === 'raw') {
    args.shift();
    const tag = args.join(" ");
    if (!tag) return message.channel.send('Укажите тег для просмотра');
    con.query(`SELECT * FROM tags WHERE name = '${tag}'`, (err, rows) => {
      if (!rows[0]) return message.channel.send("Данного тега нет в системе, вы можете занять его");
      message.channel.send(clean(rows[0].content), {
        code: 'xml'
      })
    })
  }
  if (method === 'create') {
    if (!args[0]) return message.channel.send("Укажите тег для создания");
    let tag = args.join(" ").match(/"(.*?)"/i);
    if (!tag) return message.channel.send("Укажите имя тега в \" \" а потом опишите его");
    tag = tag[1]
    const desc = args.join(" ").slice(tag.length + 10)
    if (!tag) return message.channel.send("Укажите имя тега в \" \" а потом опишите его")
    con.query(`SELECT * FROM tags WHERE name = '${tag}'`, (err, rows) => {
      if (rows[0]) return message.channel.send("Данный тег уже существует, измените его, если вы владелец");
      con.query(`INSERT INTO tags (name, owner, content) VALUES ('${tag}', '${message.author.id}', '${desc}')`);
      message.channel.send(`Тег \`${tag}\` успешно создан`)
    })
  }
}
module.exports.help = {
  name: "tag"
}
