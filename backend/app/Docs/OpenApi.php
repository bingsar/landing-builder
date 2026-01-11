<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

#[OA\Info(title: "Landing Builder API", version: "1.0.0")]
#[OA\Server(url: "http://localhost:8000", description: "Local dev")]
#[OA\Tag(name: "Pages", description: "Pages API")]
final class OpenApi
{
    #[OA\Get(
        path: "/api/pages",
        summary: "List pages",
        tags: ["Pages"],
        responses: [new OA\Response(response: 200, description: "OK")]
    )]
    public function listPages(): void
    {
    }

    #[OA\Post(
        path: "/api/pages",
        summary: "Create page",
        tags: ["Pages"],
        responses: [new OA\Response(response: 201, description: "Created")]
    )]
    public function createPage(): void
    {
    }

    #[OA\Get(
        path: "/api/pages/{id}",
        summary: "Get page draft by id",
        tags: ["Pages"],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "OK"),
            new OA\Response(response: 404, description: "Not found"),
        ]
    )]
    public function getPage(): void
    {
    }

    #[OA\Get(
        path: "/api/pages/slug/{slug}",
        summary: "Get page draft by slug",
        tags: ["Pages"],
        parameters: [new OA\Parameter(name: "slug", in: "path", required: true, schema: new OA\Schema(type: "string"))],
        responses: [
            new OA\Response(response: 200, description: "OK"),
            new OA\Response(response: 404, description: "Not found"),
        ]
    )]
    public function getPageBySlug(): void
    {
    }

    #[OA\Put(
        path: "/api/pages/{id}",
        summary: "Update page draft",
        tags: ["Pages"],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "OK"),
            new OA\Response(response: 404, description: "Not found"),
        ]
    )]
    public function updatePage(): void
    {
    }

    #[OA\Post(
        path: "/api/pages/{id}/publish",
        summary: "Publish page",
        tags: ["Pages"],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 200, description: "OK"),
            new OA\Response(response: 404, description: "Not found"),
        ]
    )]
    public function publishPage(): void
    {
    }

    #[OA\Get(
        path: "/api/pages/public/{slug}",
        summary: "Get public page by slug",
        tags: ["Pages"],
        parameters: [new OA\Parameter(name: "slug", in: "path", required: true, schema: new OA\Schema(type: "string"))],
        responses: [
            new OA\Response(response: 200, description: "OK"),
            new OA\Response(response: 404, description: "Not found"),
        ]
    )]
    public function getPublicPage(): void
    {
    }

    #[OA\Delete(
        path: "/api/pages/{id}",
        summary: "Delete page",
        tags: ["Pages"],
        parameters: [new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))],
        responses: [
            new OA\Response(response: 204, description: "Deleted"),
            new OA\Response(response: 404, description: "Not found"),
        ]
    )]
    public function deletePage(): void
    {
    }
}
