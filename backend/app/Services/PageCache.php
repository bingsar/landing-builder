<?php

namespace App\Services;

use App\Http\Resources\PagePublicResource;
use App\Repositories\PageRepository;
use Illuminate\Support\Facades\Cache;

class PageCache
{
    public function __construct(private readonly PageRepository $pages)
    {
    }

    public function forget(string $slug): void
    {
        Cache::forget($this->key($slug));
    }

    public function rememberPublic(string $slug): array
    {
        return Cache::rememberForever($this->key($slug), function () use ($slug) {
            $page = $this->pages->findBySlugOrFail($slug);

            if ($page->published_json === null) {
                abort(404);
            }

            return PagePublicResource::make($page)->toArray(request());
        });
    }

    private function key(string $slug): string
    {
        return 'pages:public:' . $slug;
    }
}
