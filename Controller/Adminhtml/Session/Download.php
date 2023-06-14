<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Adminhtml\Session;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Exception\LocalizedException;

class Download implements HttpGetActionInterface
{
    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly ResultFactory $resultFactory,
        protected readonly \Magento\Framework\Filesystem $filesystem,
    ) {
    }

    public function execute()
    {
        $hash = $this->request->getParam('hash');
        $directoryVar = $this->filesystem->getDirectoryRead(DirectoryList::VAR_DIR);

        $path = "bug-replay/{$hash}.json";
        if (!$directoryVar->isExist($path)) {
            throw new LocalizedException(__('Session not found.'));
        }

        $resultRaw = $this->resultFactory->create(ResultFactory::TYPE_RAW);
        $resultRaw->setHeader('Content-Type', 'application/javascript');
        $resultRaw->setContents($directoryVar->readFile($path));
        return $resultRaw;
    }
}
