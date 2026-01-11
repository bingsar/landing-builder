<?php

namespace App\DTO;

class PageData
{
    public function __construct(
        public string $title,
        public string $slug,
        public array $draftJson = [],
        public ?array $publishedJson = null,
    ) {
    }
}
