function vote(thisorthat, callback) {
    db.run('INSERT INTO thisorthat (id_item_a, id_item_b, selected, id_user) VALUES (?, ?, ?, ?)',
        [thisorthat.id_item_a, thisorthat.id_item_b, thisorthat.selected, thisorthat.id_user],
        function (err) {
            if (err) {
                return callback(err, this);
            }

            return callback(null, this);
        });
}

function getTop500(callback) {
    db.all(`
    SELECT i.*, count(1) as total
    FROM item i
    INNER JOIN thisorthat t on t.selected = i.id
    GROUP BY i.id
    ORDER BY total desc
    LIMIT 500;
    `, [], (err, rows) => callback(err, rows));
}

module.exports = {};
module.exports.vote = vote;
module.exports.getTop500 = getTop500;
