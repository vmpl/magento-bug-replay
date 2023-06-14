<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Adminhtml\Session;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\View\Result\Page;

class Index implements HttpGetActionInterface
{
    public function __construct(
        protected readonly ResultFactory $resultFactory,
    ) {
    }

    public function execute()
    {
        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
        $resultPage->setActiveMenu('VMPL_BugReplay::report_customers_bug_replay');
        $resultPage->addBreadcrumb(__('Bug Sessions'), __('Bug Sessions'));
        $resultPage->getConfig()->getTitle()->prepend(__('Bug Sessions'));

        return $resultPage;
    }
}
