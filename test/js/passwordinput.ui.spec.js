describe('PasswordInput', function() {
	beforeEach(function() {
		browser().navigateTo('/test/js/html/passwordinput.html');
		element('.passwordInput--passwordInput').attr('ng-model', 'password');
		element('.passwordInput--textInput').attr('ng-model', 'text');
	});
	afterEach(function() {
		browser().navigateTo('');
	});

	describe('Icon click', function() {
		it('should change passwordInput state back and forth', function() {
			element('.passwordInput--icon').click();
			expect(element('.passwordInput-revealed').count()).toBe(1);

			element('.passwordInput--icon').click();
			expect(element('.passwordInput-revealed').count()).toBe(0);
		});
	});

	describe('Form submit', function() {
		it('should send correct info on form submit without toggleRevealedState', function() {
			input('password').enter('abc');
			element('button').click();
			sleep(.5);

			expect(browser().window().search()).toBe('?pwd=abc');
		});

		it('should send correct info on form submit after toggleRevealedState (revealed)', function() {
			element('.passwordInput--icon').click();
			input('text').enter('abc');
			element('button').click();
			sleep(.5);

			expect(browser().window().search()).toBe('?pwd=abc');
		});

		it('should send correct info on form submit after toggleRevealedState (disclosed)', function() {
			element('.passwordInput--icon').click();
			element('.passwordInput--icon').click();
			input('password').enter('abc');
			element('button').click();
			sleep(.5);

			expect(browser().window().search()).toBe('?pwd=abc');
		});
	});
});