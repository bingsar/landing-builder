<?php

namespace App\Repositories;

use App\DTO\PageData;
use App\Models\Page;
use Illuminate\Database\Eloquent\Collection;

class PageRepository
{
    public function create(PageData $data): Page
    {
        return Page::create([
            'title' => $data->title,
            'slug' => $data->slug,
            'draft_json' => $data->draftJson,
            'published_json' => $data->publishedJson,
        ]);
    }

    public function update(Page $page, PageData $data): Page
    {
        $page->fill([
            'title' => $data->title,
            'slug' => $data->slug,
            'draft_json' => $data->draftJson,
            'published_json' => $data->publishedJson,
        ]);
        $page->save();

        return $page;
    }

    public function delete(Page $page): void
    {
        $page->delete();
    }

    public function findBySlugOrFail(string $slug): Page
    {
        return Page::where('slug', $slug)->firstOrFail();
    }

    public function listAll(): Collection
    {
        return Page::query()->orderByDesc('updated_at')->get();
    }
}
