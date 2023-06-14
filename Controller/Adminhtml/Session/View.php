<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Adminhtml\Session;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;

class View implements HttpGetActionInterface
{
    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly ResultFactory $resultFactory,
    ) {
    }

    public function execute()
    {
        $hash = $this->request->getParam('id');
        return $this->resultFactory->create(ResultFactory::TYPE_PAGE);
    }
}
