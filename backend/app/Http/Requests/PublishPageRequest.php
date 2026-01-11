<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublishPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'published_json' => ['nullable', 'array'],
        ];
    }
}
