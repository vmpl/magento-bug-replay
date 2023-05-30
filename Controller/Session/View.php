<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Session;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\ResultFactory;

class View implements HttpGetActionInterface
{
    public function __construct(
        protected readonly ResultFactory $resultFactory,
    ) {
    }

    public function execute()
    {
        return $this->resultFactory->create(ResultFactory::TYPE_PAGE);
    }
}
