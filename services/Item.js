function save(item, callback) {
    db.run('INSERT INTO item (name, image, user_id) VALUES (?, ?, ?)',
        [item.name, item.image, item.user_id],
        function (err) {
            if (err) {
                return callback(err, this);
            }

            return callback(null, this);
        });
}

function getRandomPairsNotVotedByUser(quantity, user, callback) {
    db.all(`
    SELECT 
        a.id as thisID, a.name as thisName, a.image thisImage, 
        b.id as thatID, b.name as thatName, b.image thatImage
    FROM item a
    INNER JOIN item b ON a.id < b.id
    ORDER BY a.id * random()
    LIMIT ?;
    `,
        [quantity], (err, rows) => {
            if (err) {
                return callback(err, null);
            }

            return callback(null, rows);
        });
}

module.exports = {};
module.exports.save = save;
module.exports.getRandomPairsNotVotedByUser = getRandomPairsNotVotedByUser;
