<?php declare(strict_types=1);

namespace VMPL\BugReplay\Model;

use Magento\Cms\Api\Data\PageInterface;
use Magento\Cms\Api\PageRepositoryInterface\Proxy as PageRepositoryInterface;
use Magento\Cms\Helper\Page\Proxy as HelperPage;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\App\Helper\AbstractHelper;
use VMPL\BugReplay\Types\StoreConfig;

class StoreConfigProvider extends AbstractHelper
{
    public function __construct(
        protected readonly ScopeConfigInterface    $config,
        protected readonly PageRepositoryInterface $pageRepository,
        protected readonly SearchCriteriaBuilder   $searchCriteriaBuilder,
        protected readonly HelperPage              $helperPage,
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

    public function getPolicyPageUrl($storeId = null): ?string
    {
        $configIdentifier = $this->getValue(StoreConfig::CmsPolicyPage);
        $configIdentifier = explode('|', $configIdentifier, 1);
        if (empty($configIdentifier)) {
            return null;
        }

        $identifier = array_shift($configIdentifier);
        if (($pageId = array_shift($configIdentifier))) {
            return $this->helperPage->getPageUrl($pageId);
        }

        $this->searchCriteriaBuilder->setPageSize(1);
        $this->searchCriteriaBuilder->addFilter(PageInterface::IDENTIFIER, $identifier);
        $searchResults = $this->pageRepository->getList($this->searchCriteriaBuilder->create());
        $items = $searchResults->getItems();

        /** @var PageInterface $item */
        $item = array_shift($items);
        return $this->helperPage->getPageUrl($item->getId());
    }
}
