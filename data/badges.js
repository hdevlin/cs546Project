const mongoCollections = require("../config/mongoCollections");
const badges = mongoCollections.badges;
const lesson = require('./lessons');
const { ObjectId } = require('mongodb');
const ERRORS = require("./common").ERRORS;

function checkId(id) {
    if (!id || typeof id != 'string') throw "You must provide an id to search for";
}

function checkName(name) {
    if (!name || typeof name != 'string') throw "You must provide an name";
}

function checkReq(requirements) {
    if (!requirements || typeof requirements != 'object') throw "You must provide a list of required lesson ids";
}

function checkDesc(description) {
    if (!description || typeof description != 'string') throw "You must provide a description";
}

function checkFile(file) {
    if (!file || typeof file != 'string') throw "You must provide a filename";
}

/**
 * Badge = {
 *    _id: string
 *    name: string
 *    requirements: array
 *    description: string
 *    file: string
 * }
 */
module.exports = {

    /* Add a badge */
    async addBadge(name, requirements, description, file) {
        checkName(name);
        checkReq(requirements);
        checkDesc(description);
        checkFile(file);

        const badgeCollection = await badges();

        const newBadge = {
            name: name,
            requirements: requirements,
            description: description,
            file: file
        };

        const insertInfo = await badgeCollection.insertOne(newBadge);
        if (insertInfo.insertedCount === 0) throw ERRORS.NOMODIFY;

        // update badges in lesson
        for (var i in requirements) {
            let badgeLesson = await lesson.getLessonByName(requirements[i]);
            if (!badgeLesson) throw "New badge does not require a valid lesson";
            badgeLesson.badges.push(insertInfo.insertedId.toString());
            await lesson.updateLesson(badgeLesson._id.toString(), { badges: badgeLesson.badges });
        }

        return this.getBadge(insertInfo.insertedId.toString());
    },

    /**
     * Get all badges as array of objects
     */
    async getAllBadges() {
        const badgeCollection = await badges();
        const badgeList = await badgeCollection.find({}).toArray();
        return badgeList;
    },

    /* Get a badge by id */
    async getBadge(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const badgeCollection = await badges();
        const badge = await badgeCollection.findOne({ _id: objId });
        if (badge === null) throw ERRORS.NOEXIST;

        return badge;
    },

    /* Update a badge by id & options */
    async updateBadge(id, options) {
        checkId(id);
        if (!options) throw "You must provide options to update a badge";
        const objId = ObjectId.createFromHexString(id);

        const badgeCollection = await badges();
        let originalBadge = await this.getBadge(id);

        const updatedBadge = {};
        const allOptions = ['name', 'requirements', 'description', 'file'];
        for (var i in allOptions) {
            let op = allOptions[i];
            if (options[allOptions[i]]) {
                updatedBadge[op] = options[op];
                if (op == 'requirements') {
                    // need to update badges in lesson
                    for (var i in options['requirements']) {
                        let badgeLesson = await lesson.getLessonByName(options['requirements'][i]);
                        if (!badgeLesson) throw "New badge does not require a valid lesson";
                        badgeLesson.badges.push(id);
                        await lesson.updateLesson(badgeLesson._id.toString(), { badges: badgeLesson.badges });
                    }
                }
            } else {
                updatedBadge[op] = originalBadge[op];
            }
        }

        const updatedInfo = await badgeCollection.updateOne(
            { 
                _id: objId
            },
            {
                $set: updatedBadge,
            }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return await this.getBadge(id);
    },

    /* Remove a badge by id */
    async removeBadge(id) {
        checkId(id);
        const objId = ObjectId.createFromHexString(id);

        const badgeCollection = await badges();

        const deletionInfo = await badgeCollection.deleteOne({
            _id: objId
        });
        if (deletionInfo.deletedCount === 0) {
            throw ERRORS.NOMODIFY;
        }

        return true;
    }
};
