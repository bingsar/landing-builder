<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'draft_json' => $this->draft_json,
            'published_json' => $this->published_json,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
