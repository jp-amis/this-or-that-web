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

module.exports = {};
module.exports.vote = vote;
