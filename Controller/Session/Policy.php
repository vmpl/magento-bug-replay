<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Session;

use Magento\Cms\Api\Data\PageInterface;
use Magento\Cms\Api\PageRepositoryInterface;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\ResultFactory;
use VMPL\BugReplay\Model\StoreConfigProvider;
use VMPL\BugReplay\Types\StoreConfig;

class Policy implements HttpGetActionInterface
{
    public function __construct(
        protected readonly ResultFactory $resultFactory,
        protected readonly StoreConfigProvider $storeConfigProvider,
        protected readonly PageRepositoryInterface $pageRepository,
        protected readonly SearchCriteriaBuilder $searchCriteriaBuilder,
        protected readonly \Magento\Cms\Helper\Page $helperPage,
    ) {
    }

    public function execute()
    {
        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);

        $configIdentifier = $this->storeConfigProvider->getValue(StoreConfig::CmsPolicyPage);
        $configIdentifier = explode('|', $configIdentifier, 1);
        if (empty($configIdentifier)) {
            $resultRedirect->setPath('noroute');
            return $resultRedirect;
        }

        $identifier = array_shift($configIdentifier);
        if (($pageId = array_shift($configIdentifier))) {
            $pageUrl = $this->helperPage->getPageUrl($pageId);
            $resultRedirect->setUrl($pageUrl);
            return $resultRedirect;
        }

        $this->searchCriteriaBuilder->setPageSize(1);
        $this->searchCriteriaBuilder->addFilter(PageInterface::IDENTIFIER, $identifier);
        $searchResults = $this->pageRepository->getList($this->searchCriteriaBuilder->create());
        $items = $searchResults->getItems();

        /** @var PageInterface $item */
        $item = array_shift($items);
        $pageUrl = $this->helperPage->getPageUrl($item->getId());
        $resultRedirect->setUrl($pageUrl);
        return $resultRedirect;
    }
}
