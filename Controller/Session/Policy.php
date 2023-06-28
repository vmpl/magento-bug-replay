<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Session;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\ResultFactory;
use VMPL\BugReplay\Model\StoreConfigProvider;

class Policy implements HttpGetActionInterface
{
    public function __construct(
        protected readonly ResultFactory $resultFactory,
        protected readonly StoreConfigProvider $storeConfigProvider,
    ) {
    }

    public function execute()
    {
        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);

        if (($pageUrl = $this->storeConfigProvider->getPolicyPageUrl())) {
            return $resultRedirect->setUrl($pageUrl);
        }

        return $resultRedirect->setPath('noroute');
    }
}
