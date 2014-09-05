var should = require('should');
var assert = require('assert');
var request = require('supertest');
var Browser = require('zombie');
var url = require('url');
var utils = require('../utils/utils');
var cssUtils = utils.css;
var pageUtils = utils.page;
var conf = require('../test-config');
var faker = require('Faker');
var Chance = require('chance');
var chance = new Chance();

//==========================================================================================================
//	HELPER
//==========================================================================================================

function fillCompanyInfo(browser, userInfo, companyInfo, partyType) {
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
}

function assertUpdatePage(browser, party, companyInfo, userInfo) {

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
}

function assertUpdateCookie(browser, party, companyInfo, userInfo) {

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
}

function generateUserInfor() {
	return {
		firstName: chance.first(),
		lastName: chance.last(),
		title: chance.sentence(),
		email: TEST_EMAIL
	};
}

function generateCompanyInfor() {
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

//==========================================================================================================
//	CONTS
//==========================================================================================================

var REVIEW_URL = '',
	TEST_EMAIL = '',
	userInfo = generateUserInfor(),
	companyInfo = generateCompanyInfor(),
	secondCompanyInfo = generateCompanyInfor(),
	thirdUserInfo = generateUserInfor(),
	thirdCompanyInfo = generateCompanyInfor(),
	fourthUserInfo = generateUserInfor(),
	fourthCompanyInfo = generateCompanyInfor(),
	date = chance.birthday({
		string: true,
		american: true,
		year: chance.year({
			min: 2010,
			max: 2015
		})
	}),
	purpose = faker.Lorem.paragraph().split('\n')[0],
	term = 'two (2) years';



//==========================================================================================================
//	TESTS
//==========================================================================================================

describe('Home Page Test:', function() {

	var urlHttp = 'http://' + conf.testDomain;
	var browser = new Browser({
		debug: false
	});
	browser.waitFor = 40000; // Wait for at least 40 seconds for a page to resolve all javascript and any timers to fire.

	describe('Content Test For etherapi: ', function() {

		this.timeout(60000);

		//-------------------------------------------------------------
		// READ INTERCEPT HOME PAGE IN PREPARATION FOR TESTS
		//-------------------------------------------------------------

		// Log into Admin page before run tests.
		before(function(done) {
			browser
				.visit(urlHttp)
				.then(function() {
					console.log('Test1: Got Homepage - processing');
					done();
				})
				.fail(function(error) {
					console.log('Home Page Test: before: error: ' + error);
					browser.close();
					return done(error);
				});
		});

		after(function(done) {
			browser.close();
			done();
		});

		//-------------------------------------------------------------
		// 1.0 ENTER HOME PAGE
		//-------------------------------------------------------------
		it('should have appropriate statusCode', function(done) {

			try {
				pageUtils.assertLoadSuccess(browser);
				//cssUtils.assertClass(browser, '.login-btn', 'login-btn');
				// wait for loading js files
				//pageUtils.waitLoadScripts(browser, done);
				//browser.dump();
				//browser.resources.dump();
				
			} catch (err) {
				console.log('Parse eTherapi Headers: ERROR: ' + err);
				return done(err);
			}
		});


	});
});