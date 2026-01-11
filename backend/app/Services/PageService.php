<?php

namespace App\Services;

use App\DTO\PageData;
use App\Models\Page;
use App\Repositories\PageRepository;

class PageService
{
    public function __construct(
        private readonly PageRepository $pages,
        private readonly PageCache $cache,
    ) {
    }

    public function create(PageData $data): Page
    {
        return $this->pages->create($data);
    }

    public function update(Page $page, PageData $data): Page
    {
        $originalSlug = $page->slug;
        $updated = $this->pages->update($page, $data);

        if ($originalSlug !== $updated->slug) {
            $this->cache->forget($originalSlug);
        }

        return $updated;
    }

    public function publish(Page $page, ?array $publishedJson): Page
    {
        $payload = $publishedJson ?? $page->draft_json;

        if ($payload === null) {
            abort(422, 'Draft is empty; provide published_json or save a draft first.');
        }

        $data = new PageData(
            title: $page->title,
            slug: $page->slug,
            draftJson: $page->draft_json ?? [],
            publishedJson: $payload,
        );

        $updated = $this->pages->update($page, $data);
        $this->cache->forget($updated->slug);

        return $updated;
    }

    public function delete(Page $page): void
    {
        $this->cache->forget($page->slug);
        $this->pages->delete($page);
    }
}
