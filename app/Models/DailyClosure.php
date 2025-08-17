<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\DailyClosure
 *
 * @property int $id
 * @property string $closure_date
 * @property int $closed_by
 * @property float $total_sales
 * @property float $cash_sales
 * @property float $card_sales
 * @property float $qr_code_sales
 * @property int $transaction_count
 * @property array $sales_by_user
 * @property array $top_products
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $closedBy
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure query()
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereCardSales($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereCashSales($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereClosedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereClosureDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereQrCodeSales($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereSalesByUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereTopProducts($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereTotalSales($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereTransactionCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailyClosure whereUpdatedAt($value)
 * @method static \Database\Factories\DailyClosureFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class DailyClosure extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'closure_date',
        'closed_by',
        'total_sales',
        'cash_sales',
        'card_sales',
        'qr_code_sales',
        'transaction_count',
        'sales_by_user',
        'top_products',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'closure_date' => 'date',
        'total_sales' => 'decimal:2',
        'cash_sales' => 'decimal:2',
        'card_sales' => 'decimal:2',
        'qr_code_sales' => 'decimal:2',
        'transaction_count' => 'integer',
        'sales_by_user' => 'array',
        'top_products' => 'array',
    ];

    /**
     * Get the user who closed the day.
     */
    public function closedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by');
    }
}