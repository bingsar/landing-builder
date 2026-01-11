<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (!$this->has('slug')) {
            return;
        }

        $slug = trim((string) $this->input('slug', ''));
        $this->merge([
            'slug' => $slug !== '' ? $slug : 'untitled_page',
        ]);
    }

    public function rules(): array
    {
        $pageId = $this->route('page')?->id;

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:pages,slug,' . $pageId],
            'draft_json' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
