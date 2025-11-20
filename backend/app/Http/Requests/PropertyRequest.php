<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $propertyId = $this->route('property')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:50'],
            'type' => ['required', 'string', Rule::in(['apartment', 'house', 'villa', 'land', 'office', 'shop'])],
            'transaction_type' => ['required', 'string', Rule::in(['sale', 'rent'])],
            'price' => ['required', 'numeric', 'min:0'],
            'surface' => ['required', 'numeric', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0', 'max:20'],
            'bathrooms' => ['nullable', 'integer', 'min:0', 'max:10'],
            'location_id' => ['required', 'integer', 'exists:locations,id'],
            'address' => ['nullable', 'string', 'max:500'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:100'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['sometimes', 'string', Rule::in(['draft', 'published', 'sold', 'archived'])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire',
            'description.required' => 'La description est obligatoire',
            'description.min' => 'La description doit contenir au moins 50 caractères',
            'type.required' => 'Le type de propriété est obligatoire',
            'transaction_type.required' => 'Le type de transaction est obligatoire',
            'price.required' => 'Le prix est obligatoire',
            'price.numeric' => 'Le prix doit être un nombre',
            'surface.required' => 'La surface est obligatoire',
            'location_id.required' => 'La localisation est obligatoire',
            'location_id.exists' => 'La localisation sélectionnée n\'existe pas',
        ];
    }
}

