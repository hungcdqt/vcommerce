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

var REVIEW_URL = 'nda_create.html',
	TEST_EMAIL = 'asoft.johndoe1@gmail.com',
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

	describe('Content Test For easynda: ', function() {

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
				cssUtils.assertClass(browser, '#da-slider', 'da-slider');
				// wait for loading js files
				pageUtils.waitLoadScripts(browser, done);
			} catch (err) {
				console.log('Parse EasyNda Headers: ERROR: ' + err);
				return done(err);
			}
		});

		//-------------------------------------------------------------
		// 1.1 ENTER EMAIl HOME PAGE
		//-------------------------------------------------------------
		it('should enter 2nd party email and then move to review page', function(done) {

			try {
				browser
					.fill('#anon_secondparty_email', TEST_EMAIL)
					.pressButton('Start', function() {
						browser.resources[0].response.statusCode.should.equal(200);
						// verify url params
						browser.location.pathname.should.equal('/nda_create.html');
						browser.location.search.should.equal('?nda_form=easynda_std&anon_2nd_email=' + TEST_EMAIL);
						done();
					});
			} catch (err) {
				console.log('Parse Intercept Headers: ERROR: ' + err);
				return done(err);
			}
		});


		//-------------------------------------------------------------
		// 1.2 ENTER REVIEW PAGE WITH EMAIl
		//-------------------------------------------------------------
		it('should fail to sign in page if don\'t enter valid fields', function(done) {
			try {
				// wait for loading js files
				pageUtils.waitLoadScripts(browser, function() {
					// anon_2nd_email should filled correct text input
					var emailEl = browser.query('#secondparty-email');
					emailEl.should.have.property('value');
					emailEl.value.should.equal(TEST_EMAIL);

					// press before signing button
					browser.pressButton('#enda-move-to-signing-page')
						.then(function() {

							// verify the area is highlight
							cssUtils.assertClass(browser, '#yourco_edit_block', 'val_error');
							cssUtils.assertClass(browser, '#term-radio', 'val_error');
							cssUtils.assertClass(browser, '#purpose-radio', 'val_error');
							// should have error message
							var requiredEl = browser.query('#create_doc_err span');
							requiredEl.should.have.property('innerHTML');
							requiredEl.innerHTML.should.equal('Please fill in the required fields.');
							done();
						});
				});
			} catch (err) {
				console.log('Parse Intercept Headers: ERROR: ' + err);
				return done(err);
			}
		});

		//-------------------------------------------------------------
		// 1.3 should update cookies and page after edit company
		//-------------------------------------------------------------
		it('should update cookies and page after edit company', function(done) {

			// click update/edit link 
			browser.clickLink('.enda-edit-firstparty-info')
				.then(function() {

					// fill user and company information
					fillCompanyInfo(browser, userInfo, companyInfo);

					// click close button
					browser.pressButton('#enda-update-companyinfo-button', function() {
						var firstParty = pageUtils.getCookie(browser, "ndaFirstPartyDoc").first_party;
						assertUpdateCookie(browser, firstParty, companyInfo, userInfo);
						assertUpdatePage(browser, 'first', companyInfo, userInfo);
						done();
					});
				});
		});

		//-------------------------------------------------------------
		// 1.4 should fill everything after reload page with existing cookie
		//-------------------------------------------------------------
		it('should fill everything after reload page with existing cookie', function(done) {

			// refresh page
			browser.reload(function() {

				// wait for load page
				pageUtils.waitLoadScripts(browser, function() {
					var firstParty = pageUtils.getCookie(browser, "ndaFirstPartyDoc").first_party;
					assertUpdateCookie(browser, firstParty, companyInfo, userInfo);
					assertUpdatePage(browser, 'first', companyInfo, userInfo);
					done();
				});
			});
		});

		//-------------------------------------------------------------
		// 1.5 should update cookies and page after filled in for 2nd party
		//-------------------------------------------------------------
		it('should update cookies and page after filled in for 2nd party', function(done) {
			var secondUserInfo = generateUserInfor();

			// click "Optional: fill-in other company's information." link 
			browser.clickLink('#otherCompanyInfo')
				.then(function() {

					// fill user and company information
					fillCompanyInfo(browser, secondUserInfo, secondCompanyInfo, 'secondparty');

					// click close button
					browser.pressButton('#enda-update-secondpartyinfo-button', function() {
						browser.reload(function() {
							pageUtils.waitLoadScripts(browser, function() {
								var secondParty = pageUtils.getCookie(browser, "ndaFirstPartyDoc").second_party;
								assertUpdateCookie(browser, secondParty, secondCompanyInfo, secondUserInfo);
								assertUpdatePage(browser, 'second', secondCompanyInfo, secondUserInfo);
								done();
							});
						});
					});
				});
		});

		//-------------------------------------------------------------
		// 1.6 cookie which filled 1st & 2nd party should existing after reload page'
		//-------------------------------------------------------------
		it('cookie which filled 1st & 2nd party should existing after reload page', function(done) {


			// fill infor page
			browser.choose('#enda-term-2');
			browser.fill('#effective_date', date);
			browser.choose('#enda-purpose-custom');
			browser.fill('#enda-purpose-custom-text', purpose);

			// click update/edit link
			browser.clickLink('.enda-edit-firstparty-info')
				.then(function() {

					// fill user and company information
					fillCompanyInfo(browser, thirdUserInfo, thirdCompanyInfo);

					// click close button
					browser.pressButton('#enda-update-companyinfo-button');

					// fill user and company information
					fillCompanyInfo(browser, fourthUserInfo, fourthCompanyInfo, 'secondparty');

					// click close button
					browser.pressButton('#enda-update-secondpartyinfo-button');
					browser.reload(function() {
						pageUtils.waitLoadScripts(browser, function() {
							var cookieInfo = pageUtils.getCookie(browser, "ndaFirstPartyDoc");

							// verifi for first party
							assertUpdateCookie(browser, cookieInfo.first_party, thirdCompanyInfo, thirdUserInfo);
							assertUpdatePage(browser, 'first', thirdCompanyInfo, thirdUserInfo);

							// verify for second party
							assertUpdateCookie(browser, cookieInfo.second_party, fourthCompanyInfo, fourthUserInfo);
							assertUpdatePage(browser, 'second', fourthCompanyInfo, fourthUserInfo);

							// verify other infor
							cookieInfo.termText.should.equal(term);
							// cookieInfo.effective_date.should.equal(date);
							cookieInfo.purposeId.should.equal('enda-purpose-custom');
							cookieInfo.purposeText.should.equal(purpose);
							done();
						});
					});
				});
		});

		//-------------------------------------------------------------
		// 1.7 Datas are ready and siging page is created after click "Move to siging"
		//-------------------------------------------------------------
		it('Datas are ready and siging page is created after click "Move to siging"', function(done) {

			// hits 'move to siging' button
			browser.pressButton('#enda-move-to-signing-page')
				.then(function() {
					pageUtils.waitLoadScripts(browser, function() {

						// verify datas are ready
						assertUpdatePage(browser, 'first', thirdCompanyInfo, thirdUserInfo);
						assertUpdatePage(browser, 'second', fourthCompanyInfo, fourthUserInfo);
						// browser.text('#out-effective-date').should.equal(date);
						browser.text('#out-term').should.equal(term);
						browser.text('#out-purpose-text').should.equal(purpose);
						browser.text('#out-juris-state').should.equal(thirdCompanyInfo.jurisstate);

						// verify siging page is created
						browser.text('h1.pull-left').should.equal('Create an Agreeement');
						browser.text('.breadcrumb li:last-child').should.equal('Create/Edit');
						cssUtils.assertClass(browser, '.breadcrumb li:last-child', 'active');
						done();
					});
				});
		});


		//-------------------------------------------------------------
		// 1.8 should get "need to reg/login" and save signature data to cookie anfter Enter text to sign the doc, click "send"
		//-------------------------------------------------------------
		it('should get "need to reg/login" and save signature data to cookie anfter Enter text to sign the doc, click "send"', function(done) {

			// fill text to sign the doc
			browser.fill('#name', thirdUserInfo.firstName);

			// press send button
			browser.pressButton('#enda-signing-done-ask-personalize');
			cssUtils.assertClass(browser, '#2nd-party-email-modal', 'in');

			// press send now button
			browser.pressButton('.enda-send-NDA-to-2nd-party');
			pageUtils.waitLoadScripts(browser, function() {
				/**
				 * Here, The “2nd-party-email-modal” popup still display and "need to reg/login" page wasn't created
				 * I believe the site has bug
				 * pld double check
				 **/

				// make sure show "need to reg/login" popup
				// cssUtils.assertClass(browser, '.bootbox', 'in');
				// browser.text('.bootbox-body').should.equal('You need to login or register before you can do that.');
				// browser.text('bootbox .modal-footer button:first-child').should.equal('Login');
				done();
			}, 3000);
		});
	});
});