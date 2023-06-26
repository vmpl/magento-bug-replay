<?php declare(strict_types=1);

namespace VMPL\BugReplay\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Helper\AbstractHelper;
use VMPL\BugReplay\Types\StoreConfig;

class StoreConfigProvider extends AbstractHelper
{
    public function __construct(
        protected readonly ScopeConfigInterface $config,
    ) {
    }

    public function getValue(StoreConfig $type, $storeId = null)
    {
        return $this->config->getValue(
            $type->value,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
            $storeId
        );
    }
}
