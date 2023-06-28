<?php declare(strict_types=1);

namespace VMPL\BugReplay\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use VMPL\BugReplay\Model\StoreConfigProvider;
use VMPL\BugReplay\Types\StoreConfig;

class Session implements ArgumentInterface
{
    public function __construct(
        protected readonly StoreConfigProvider $configProvider,
    ) {
    }

    public function getStoreCoreConfig(): array
    {
        return array_map(
            fn ($case) => $this->configProvider->getValue($case),
            StoreConfig::getGroupCases('storefront'),
        );
    }
}
