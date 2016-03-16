describe('PasswordInput', function() {
	var customConfig = {
		REVEALED_ICON_TMPL: '123',
		HIDDEN_ICON_TMPL: '456'
	};

	beforeEach(function() {
		document.body.innerHTML = '<input type="password">';
	});
	afterEach(function() {
		document.body.innerHTML = '';
	});

	describe('#constructor', function() {
		it('should create correct HTML structure', function() {
			new PasswordInput(document.querySelector('input'));

			expect(document.querySelector('.passwordInput')).not.toBeNull();
			expect(document.querySelector('.passwordInput--passwordInput')).not.toBeNull();
			expect(document.querySelector('.passwordInput--textInput')).not.toBeNull();
			expect(document.querySelector('.passwordInput--icon')).not.toBeNull();
		});

		it('should leave password input untouched', function() {
			var input = document.querySelector('input');
			new PasswordInput(input);

			expect(document.querySelector('.passwordInput--passwordInput')).toBe(input);
		});

		describe('E_CREATED', function() {
			var spy, input;

			beforeEach(function() {
				spy = jasmine.createSpy('created');
				input = document.querySelector('input');
				input.addEventListener(PasswordInput.E_CREATED, spy);
				new PasswordInput(input);
			});
			afterEach(function() {
				spy = input = null;
			});

			it('should be triggered', function() {
				expect(spy).toHaveBeenCalled();
				expect(spy.calls.length).toBe(1);
			});

			it('should receive block as E_CREATED detail', function() {
				expect(spy.mostRecentCall.args[0].detail.block).toBe(document.querySelector('.passwordInput'));
			});

			it('should receive eventTarget as E_CREATED detail', function() {
				expect(spy.mostRecentCall.args[0].detail.eventTarget).toBe(input);
			});
		});
	});
	describe('custom config', function() {
		var pi, input;

		beforeEach(function() {
			input = document.querySelector('input');
			pi = new PasswordInput(document.querySelector('input'), customConfig);
		});
		afterEach(function() {
			pi = input = null;
		});
		it('should update icon inner depending on state', function() {
			expect(document.querySelector('.passwordInput--icon').innerHTML).toEqual('456');

			pi.toggleRevealedState();

			expect(document.querySelector('.passwordInput--icon').innerHTML).toEqual('123');

			pi.toggleRevealedState();

			expect(document.querySelector('.passwordInput--icon').innerHTML).toEqual('456');
		});
	});
	describe('Methods', function() {
		var pi, input;

		beforeEach(function() {
			input = document.querySelector('input');
			pi = new PasswordInput(document.querySelector('input'));
		});
		afterEach(function() {
			pi = input = null;
		});

		describe('#setRevealedState()', function() {
			it('should add modifier "-revealed" to block', function() {
				expect(document.querySelector('.passwordInput-revealed')).toBeNull();

				pi.setRevealedState();

				expect(document.querySelector('.passwordInput-revealed')).not.toBeNull();
			});

			it('should set value from --passwordInput to --textInput', function() {
				input.value = 'abc';
				pi.setRevealedState();

				expect(document.querySelector('.passwordInput--textInput').value).toBe('abc');

				pi.removeRevealedState();
				input.value = '';
				pi.setRevealedState();

				expect(document.querySelector('.passwordInput--textInput').value).toBe('');
			});

			it('should move --passwordInput\'s name to --textInput', function() {
				input.name = 'pwd';

				pi.setRevealedState();

				expect(document.querySelector('.passwordInput--textInput').name).toBe('pwd');
				expect(input.name).toBe('');
			});

			it('should move --passwordInput\'s id to --textInput', function() {
				input.id = 'Pwd';

				pi.setRevealedState();

				expect(document.querySelector('.passwordInput--textInput').id).toBe('Pwd');
				expect(input.id).toBe('');
			});

			it('should set focus to --textInput', function() {
				pi.setRevealedState();
				expect(document.activeElement).toBe(document.querySelector('.passwordInput--textInput'));
			});

			it('should set caret to the end of --textInput', function() {
				var textInput = document.querySelector('.passwordInput--textInput');

				pi.setRevealedState();

				expect(textInput.selectionStart).toBe(0);
				expect(textInput.selectionEnd).toBe(0);

				pi.removeRevealedState();
				input.value = 'abc';
				pi.setRevealedState();

				expect(textInput.selectionStart).toBe(3);
				expect(textInput.selectionEnd).toBe(3);
			});
		});

		describe('#removeRevealedState()', function() {
			it('should remove modifier "-revealed" to block', function() {
				pi.setRevealedState();

				expect(document.querySelector('.passwordInput-revealed')).not.toBeNull();

				pi.removeRevealedState();

				expect(document.querySelector('.passwordInput-revealed')).toBeNull();
			});

			it('should set value from --textInput to --passwordInput', function() {
				var textInput = document.querySelector('.passwordInput--textInput');

				pi.setRevealedState();
				textInput.value = 'abc';
				pi.removeRevealedState();

				expect(input.value).toBe('abc');

				pi.setRevealedState();
				textInput.value = '';
				pi.removeRevealedState();

				expect(input.value).toBe('');
			});

			it('should move --textInput\'s name to --passwordInput', function() {
				var textInput = document.querySelector('.passwordInput--textInput');

				pi.setRevealedState();
				textInput.name = 'pwd';
				pi.removeRevealedState();

				expect(input.name).toBe('pwd');
				expect(textInput.name).toBe('');
			});

			it('should move --textInput\'s id to --passwordInput', function() {
				var textInput = document.querySelector('.passwordInput--textInput');

				pi.setRevealedState();
				textInput.id = 'Pwd';
				pi.removeRevealedState();

				expect(input.id).toBe('Pwd');
				expect(textInput.id).toBe('');
			});

			it('should set focus to --passwordInput', function() {
				pi.setRevealedState();
				pi.removeRevealedState();
				expect(document.activeElement).toBe(document.querySelector('.passwordInput--passwordInput'));
			});

			it('should set caret to the end of --textInput', function() {
				var textInput = document.querySelector('.passwordInput--textInput');

				pi.setRevealedState();
				textInput.value = 'abc';
				pi.removeRevealedState();

				expect(textInput.selectionStart).toBe(3);
				expect(textInput.selectionEnd).toBe(3);

				pi.setRevealedState();
				textInput.value = '';
				pi.removeRevealedState();

				expect(textInput.selectionStart).toBe(0);
				expect(textInput.selectionEnd).toBe(0);
			});
		});

		describe('#toggleRevealedState()', function() {
			it('should add/remove modifier "-revealed" to block depending on its current state', function() {
				expect(document.querySelector('.passwordInput-revealed')).toBeNull();

				pi.toggleRevealedState();

				expect(document.querySelector('.passwordInput-revealed')).not.toBeNull();

				pi.toggleRevealedState();

				expect(document.querySelector('.passwordInput-revealed')).toBeNull();
			});
		});

		describe('#getBlock()', function() {
			it('should return the wrapper created in constructor', function() {
				expect(pi.getBlock()).toBe(document.querySelector('.passwordInput'));
			});
		});

		describe('#getEventTarget()', function() {
			it('should return the same element the constructor was called on', function() {
				expect(pi.getEventTarget()).toBe(input);
			});
		});
	});

	describe('Constants', function() {
		it('should provide public constants for events', function() {
			expect(PasswordInput.E_CREATED).toBe('passwordinput:created');
			expect(PasswordInput.E_SET_REVEALED).toBe('passwordinput:setrevealed');
			expect(PasswordInput.E_REMOVE_REVEALED).toBe('passwordinput:removerevealed');
			expect(PasswordInput.E_TOGGLE_REVEALED).toBe('passwordinput:togglerevealed');
		});
	});

	describe('Events API', function() {
		var input;

		beforeEach(function() {
			input = document.querySelector('input');
			new PasswordInput(input);
		});
		afterEach(function() {
			input = null;
		});

		describe('E_SET_REVEALED', function() {
			it('should add modifier "-revealed" to block', function() {
				DX.Event.trigger(input, PasswordInput.E_SET_REVEALED);

				expect(document.querySelector('.passwordInput-revealed')).not.toBeNull();
			});
		});

		describe('E_REMOVE_REVEALED', function() {
			it('should remove modifier "-revealed" to block', function() {
				DX.Event.trigger(input, PasswordInput.E_SET_REVEALED);
				DX.Event.trigger(input, PasswordInput.E_REMOVE_REVEALED);

				expect(document.querySelector('.passwordInput-revealed')).toBeNull();
			});
		});

		describe('E_TOGGLE_REVEALED', function() {
			it('should add/remove modifier "-revealed" to block depending on its current state', function() {
				DX.Event.trigger(input, PasswordInput.E_TOGGLE_REVEALED);

				expect(document.querySelector('.passwordInput-revealed')).not.toBeNull();

				DX.Event.trigger(input, PasswordInput.E_TOGGLE_REVEALED);

				expect(document.querySelector('.passwordInput-revealed')).toBeNull();
			});
		});
	});


});