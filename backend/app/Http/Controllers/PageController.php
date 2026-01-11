<?php

namespace App\Http\Controllers;

use App\DTO\PageData;
use App\Http\Requests\PublishPageRequest;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Http\Resources\PageSummaryResource;
use App\Models\Page;
use App\Repositories\PageRepository;
use App\Services\PageCache;
use App\Services\PageService;

class PageController extends Controller
{
    public function __construct(
        private readonly PageRepository $pages,
        private readonly PageService $service,
        private readonly PageCache $cache,
    ) {
    }

    public function store(StorePageRequest $request)
    {
        $data = new PageData(
            title: $request->string('title')->toString(),
            slug: $request->string('slug')->toString(),
            draftJson: $request->input('draft_json', []),
        );

        $page = $this->service->create($data);

        return (new PageResource($page))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Page $page)
    {
        return new PageResource($page);
    }

    public function index()
    {
        $pages = $this->pages->listAll();

        return PageSummaryResource::collection($pages);
    }

    public function showBySlug(string $slug)
    {
        $page = $this->pages->findBySlugOrFail($slug);

        return new PageResource($page);
    }

    public function destroy(Page $page)
    {
        $this->service->delete($page);

        return response()->json(['data' => true]);
    }

    public function update(UpdatePageRequest $request, Page $page)
    {
        $data = new PageData(
            title: $request->input('title', $page->title),
            slug: $request->input('slug', $page->slug),
            draftJson: $request->input('draft_json', $page->draft_json ?? []),
            publishedJson: $page->published_json,
        );

        $page = $this->service->update($page, $data);

        return new PageResource($page);
    }

    public function publish(PublishPageRequest $request, Page $page)
    {
        $page = $this->service->publish($page, $request->input('published_json'));

        return new PageResource($page);
    }

    public function showPublic(string $slug)
    {
        return response()->json([
            'data' => $this->cache->rememberPublic($slug),
        ]);
    }
}
