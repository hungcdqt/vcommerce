var should = require('should');
var assert = require('assert');
//==========================================================================================================
//	HELPER
//==========================================================================================================
infos = {
fillCompanyInfo: function (browser, userInfo, companyInfo, partyType) {
	partyType = partyType || 'firstparty';
	partyType = '#' + partyType;

	browser.fill(partyType + '-firstname', userInfo.firstName);
	browser.fill(partyType + '-lastname', userInfo.lastName);
	browser.fill(partyType + '-title', userInfo.title);
	browser.fill(partyType + '-company', companyInfo.company);
	browser.fill(partyType + '-address', companyInfo.address);
	browser.fill(partyType + '-city', companyInfo.city);
	browser.fill(partyType + '-state', companyInfo.state);
	browser.fill(partyType + '-zip', companyInfo.zip);
	browser.fill(partyType + '-corpstate', companyInfo.corpstate);

	if ('#firstparty' == partyType) {
		browser.fill('#firstparty-email', TEST_EMAIL);
		browser.fill('#jurisstate', companyInfo.jurisstate);
	}
},

assertUpdatePage: function(browser, party, companyInfo, userInfo) {

	if (party === 'first') {
		browser.text('#out-firstparty-company').trim().should.equal(companyInfo.company);
		browser.text('#out-firstparty-address').trim().should.equal(companyInfo.address);
		browser.text('#out-firstparty-city').trim().should.equal(companyInfo.city);
		browser.text('#out-firstparty-zip').trim().should.equal(companyInfo.zip);
		browser.text('#out-firstparty-state').trim().should.equal(companyInfo.state);
		browser.text('#out-firstparty-corpstate').trim().should.equal('A ' + companyInfo.corpstate + ' Corporation');
	} else {
		browser.text('#out-secondparty-company').trim().should.equal(companyInfo.company);
		browser.text('#out-secondparty-address').trim().should.equal(companyInfo.address);
		browser.text('#out-secondparty-city').trim().should.equal(companyInfo.city);
		browser.text('#out-secondparty-zip').trim().should.equal(companyInfo.zip);
		browser.text('#out-secondparty-state').trim().should.equal(companyInfo.state);
		browser.text('#out-secondparty-corpstate').trim().should.equal('A ' + companyInfo.corpstate + ' Corporation');
	}
},

assertUpdateCookie: function(browser, party, companyInfo, userInfo) {

	// verify cookie was updated
	party.first_name.should.equal(userInfo.firstName);
	party.last_name.should.equal(userInfo.lastName);
	party.title.should.equal(userInfo.title);
	party.company.should.equal(companyInfo.company);
	party.address.should.equal(companyInfo.address);
	party.city.should.equal(companyInfo.city);
	party.state.should.equal(companyInfo.state);
	party.zip.should.equal(companyInfo.zip);
	party.corp_state.should.equal(companyInfo.corpstate);

	// only test for first_party cookie
	if (party.juris_state) {
		party.email.should.equal(userInfo.email);
		party.juris_state.should.equal(companyInfo.jurisstate);
	}
},

generateUserInfor: function() {
	return {
		firstName: chance.first(),
		lastName: chance.last(),
		title: chance.sentence(),
		email: TEST_EMAIL
	};
},

generateCompanyInfor: function() {
	return {
		title: chance.sentence(),
		company: chance.name(),
		address: chance.address(),
		city: chance.city(),
		state: chance.state(),
		zip: chance.zip(),
		corpstate: chance.state(),
		jurisstate: chance.state()
	};
}

}