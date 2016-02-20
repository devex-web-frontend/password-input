/**
 * @fileoverview
 * @copyright Devexperts
 * @requires DX
 * @requires DX.Event
 * @requires DX.Dom
 * @requires DX.Bem
 * @requires DX.Tmpl
 * @class PasswordInput
 */
var PasswordInput = (function(DX, window, document, undefined) {
	'use strict';

	var CN_BLOCK = 'passwordInput',
		CN_PASSWORD_INPUT = CN_BLOCK + '--passwordInput',
		CN_TEXT_INPUT = CN_BLOCK + '--textInput',
		CN_ICON = CN_BLOCK + '--icon',
		MOD_REVEALED = 'revealed',
		defaultConfig = {
			INNER_TMPL: '<input type="text" class="' + CN_TEXT_INPUT + '">' +
			'<span class="' + CN_ICON + '">{%= HIDDEN_ICON_TMPL %}</span>',
			REVEALED_ICON_TMPL: '',
			HIDDEN_ICON_TMPL: ''
		};

	function setAttributes(input, otherInput) {
		input.value = otherInput.value;
		input.name = otherInput.name;
		otherInput.name = '';
		input.id = otherInput.id;
		otherInput.id = '';
	}

	function setCaretAt(input, n) {
		if (typeof input.selectionStart === 'number') {
			input.selectionStart = input.selectionEnd = n;
		} else {
			input.setSelectionRange(n, n);
		}
	}

	function setFocusAndCaret(input) {
		input.focus();
		setCaretAt(input, input.value.length); // seems to be only needed in Firefox
	}

	return function PasswordInput(passwordInput, customConfig) {
		var block,
			textInput,
			icon,
			config;

		function init() {
			config = Object.assign({}, defaultConfig, customConfig);
			createElements();

			icon.addEventListener(DX.Event.CLICK, toggleRevealedState);

			initEventsApi();

			DX.Event.trigger(passwordInput, PasswordInput.E_CREATED, {
				detail: {
					block: block,
					eventTarget: passwordInput
				}
			});
		}

		function createElements() {
			block = DX.Dom.createElement('span', {
				className: CN_BLOCK,
				html: DX.Tmpl.process(config.INNER_TMPL, config)
			});

			textInput = DX.$$('.' + CN_TEXT_INPUT, block);
			icon = DX.$$('.' + CN_ICON, block);

			DX.Dom.getParent(passwordInput).insertBefore(block, passwordInput);
			block.insertBefore(passwordInput, textInput);
			passwordInput.classList.add(CN_PASSWORD_INPUT);
		}

		function initEventsApi() {
			passwordInput.addEventListener(PasswordInput.E_SET_REVEALED, setRevealedState);
			passwordInput.addEventListener(PasswordInput.E_REMOVE_REVEALED, removeRevealedState);
			passwordInput.addEventListener(PasswordInput.E_TOGGLE_REVEALED, toggleRevealedState);
		}

		function isRevealedState() {
			return DX.Bem.hasModifier(block, MOD_REVEALED);
		}

		function toggleRevealedState() {
			if (isRevealedState()) {
				removeRevealedState();
			} else {
				setRevealedState();
			}
		}

		function setRevealedState() {
			setAttributes(textInput, passwordInput);
			DX.Bem.addModifier(block, MOD_REVEALED);
			icon.innerHTML = DX.Tmpl.process(config.REVEALED_ICON_TMPL, config);
			setFocusAndCaret(textInput);
		}

		function removeRevealedState() {
			setAttributes(passwordInput, textInput);
			DX.Bem.removeModifier(block, MOD_REVEALED);
			icon.innerHTML = DX.Tmpl.process(config.HIDDEN_ICON_TMPL, config);
			setFocusAndCaret(passwordInput);
		}

		init();

		this.setRevealedState = setRevealedState;
		this.removeRevealedState = removeRevealedState;
		this.toggleRevealedState = toggleRevealedState;
		this.getBlock = function() {
			return block;
		};
		this.getEventTarget = function() {
			return passwordInput;
		};
	};
})(DX, window, document);

PasswordInput.E_CREATED = 'passwordinput:created';
PasswordInput.E_SET_REVEALED = 'passwordinput:setrevealed';
PasswordInput.E_REMOVE_REVEALED = 'passwordinput:removerevealed';
PasswordInput.E_TOGGLE_REVEALED = 'passwordinput:togglerevealed';
