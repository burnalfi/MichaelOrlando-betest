const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const UserInfoSchema = new Schema({
	fullName: String,
	accountNumber: { type: Schema.Types.ObjectId || String, ref: 'account-login' },
	emailAddress: String,
	registrationNumber: { type: String, index: true }
});

UserInfoSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) { 
		ret.userId = ret._id;
		delete ret._id;
	}
});

const UserInfoModel = model('user-info', UserInfoSchema);

module.exports =  {
	UserInfoSchema,
	UserInfoModel
}