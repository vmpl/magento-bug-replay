<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Adminhtml\Session;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;
use VMPL\BugReplay\ViewModel\Adminhtml\Session as ViewModel;

class View implements HttpGetActionInterface
{
    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly ResultFactory    $resultFactory,
        protected readonly ViewModel        $viewModel,
    ) {
    }

    public function execute()
    {
        $hash = $this->request->getParam('id');
        $this->viewModel->setHash($hash);

        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
        $resultPage->setActiveMenu('VMPL_BugReplay::report_customers_bug_replay');
        $resultPage->addBreadcrumb(__('Bug Sessions'), __('Bug Sessions'));
        $resultPage->addBreadcrumb($hash, $hash);
        $resultPage->getConfig()->getTitle()->prepend(__('Bug Sessions'));
        $resultPage->getConfig()->getTitle()->prepend($hash);

        return $resultPage;
    }
}
