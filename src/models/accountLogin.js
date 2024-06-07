const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const AccountLoginSchema = new Schema({
	userName: String,
	password: String,
	lastLoginDateTime: {type: Date, index: true},
	userId: { type: Schema.Types.ObjectId, ref: 'user-info' }
});

AccountLoginSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) { 
		ret.accountId = ret._id;
		delete ret._id;
	}
});

const AccountLoginModel = model('account-login', AccountLoginSchema);

module.exports =  {
	AccountLoginSchema,
	AccountLoginModel
}