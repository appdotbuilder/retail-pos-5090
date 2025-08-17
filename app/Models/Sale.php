<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Sale
 *
 * @property int $id
 * @property string $receipt_number
 * @property int $user_id
 * @property float $subtotal
 * @property float $tax_amount
 * @property float $total_amount
 * @property string $payment_method
 * @property float $amount_paid
 * @property float $change_amount
 * @property string $status
 * @property string|null $customer_email
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SaleItem> $saleItems
 * @property-read int|null $sale_items_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Sale newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Sale newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Sale query()
 * @method static \Illuminate\Database\Eloquent\Builder|Sale completed()
 * @method static \Illuminate\Database\Eloquent\Builder|Sale today()
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereAmountPaid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereChangeAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereCustomerEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereReceiptNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereSubtotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereTaxAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereTotalAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Sale whereUserId($value)
 * @method static \Database\Factories\SaleFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Sale extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'receipt_number',
        'user_id',
        'subtotal',
        'tax_amount',
        'total_amount',
        'payment_method',
        'amount_paid',
        'change_amount',
        'status',
        'customer_email',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'change_amount' => 'decimal:2',
    ];

    /**
     * Get the user that owns the sale.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sale items for the sale.
     */
    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * Scope a query to only include completed sales.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include today's sales.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', now()->toDateString());
    }
}