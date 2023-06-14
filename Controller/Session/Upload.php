<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Session;

use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;
use VMPL\BugReplay\Model\UploadedSession;

class Upload implements HttpPostActionInterface, CsrfAwareActionInterface
{
    /**
     * @param RequestInterface|\Magento\Framework\App\Request\Http $request
     */
    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly ResultFactory $resultFactory,
        protected readonly \Magento\Framework\Filesystem $filesystem,
        protected readonly \VMPL\BugReplay\Model\ResourceModel\UploadedSession\CollectionFactory $collectionFactory,
    ) {
    }

    public function execute()
    {
        $database = $this->request->getFiles('database');
        $directoryTmp = $this->filesystem->getDirectoryReadByPath('/');
        $directoryVar = $this->filesystem->getDirectoryWrite(DirectoryList::VAR_DIR);

        do {
            $path = 'bug-replay/';
            $path .= $fileHash = static::randomString();
            $path .= '.json';
        } while($directoryVar->isExist($path));
        $directoryVar->writeFile($path, $directoryTmp->readFile($database['tmp_name']));

        /** @var \VMPL\BugReplay\Model\ResourceModel\UploadedSession\Collection $collection */
        /** @var UploadedSession $model */
        $collection = $this->collectionFactory->create();
        $model = $collection->getNewEmptyItem();
        $model->setHash($fileHash);
        $collection->getResource()->save($model);

        $result = $this->resultFactory->create(ResultFactory::TYPE_JSON);
        return $result->setData(['success' => true, 'fileName' => $fileHash]);
    }

    protected static function randomString(int $length = 64): string {
        $str = random_bytes($length);
        $str = base64_encode($str);
        $str = str_replace(["+", "/", "="], "", $str);
        $str = substr($str, 0, $length);
        return $str;
    }

    public function createCsrfValidationException(RequestInterface $request): ?InvalidRequestException
    {
        return null;
    }

    public function validateForCsrf(RequestInterface $request): ?bool
    {
        return true;
    }
}
