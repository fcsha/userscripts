// ==UserScript==
// @name         GitHub Hello
// @namespace    https://github.com/fcsha/userscripts
// @version      1.0.0
// @description  在 GitHub 打印 Hello world
// @author       Fucheng Sha
// @match        https://github.com/*
// @grant        none
// @noframes
// ==/UserScript==

import { hello } from '@shared/hello'

hello()
