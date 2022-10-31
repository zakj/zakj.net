/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface PageData {
    isRoot?: boolean;
    maxWidth?: string;
    title?: string;
    description?: string;
    image?: string;
  }
}
