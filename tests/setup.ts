// tests/setup.ts - happy-dom 전역 환경 설정
import { GlobalWindow } from "happy-dom";

const window = new GlobalWindow();

// 주요 DOM API를 전역으로 등록
(globalThis as any).window = window;
(globalThis as any).document = window.document;
(globalThis as any).HTMLElement = window.HTMLElement;
(globalThis as any).HTMLInputElement = window.HTMLInputElement;
(globalThis as any).HTMLFormElement = window.HTMLFormElement;
(globalThis as any).HTMLButtonElement = window.HTMLButtonElement;
(globalThis as any).HTMLLIElement = window.HTMLLIElement;
(globalThis as any).HTMLDivElement = window.HTMLDivElement;
(globalThis as any).Event = window.Event;
(globalThis as any).CustomEvent = window.CustomEvent;
(globalThis as any).FormData = window.FormData;
