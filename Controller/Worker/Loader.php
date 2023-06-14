<?php declare(strict_types=1);

namespace VMPL\BugReplay\Controller\Worker;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\View\Asset\Repository as AssetRepository;
use Magento\Framework\View\Element\Template;

class Loader implements HttpGetActionInterface
{
    public function __construct(
        protected readonly RequestInterface $request,
        protected readonly AssetRepository $assetRepository,
        protected readonly ResultFactory $resultFactory,
    ) {
    }

    public function execute()
    {
        $workerFile = $this->getWorkerFile();

        try {
            list($module, $file) = explode("/", $workerFile, 2);
            $this->assetRepository->createAsset("{$module}::{$file}.js")->getSourceFile();
        } catch (\Throwable $exception) {
            $resultForward = $this->resultFactory->create(ResultFactory::TYPE_FORWARD);
            return $resultForward->forward('noroute');
        }

        $layout = $this->resultFactory->create(ResultFactory::TYPE_LAYOUT);
        /** @var Template $block */
        $block = $layout->getLayout()->createBlock(Template::class, 'loader');
        $block->setTemplate('VMPL_BugReplay::worker-loader.phtml');
        $block->setData([
            'worker_file' => $workerFile,
            'baseUrl' => $this->assetRepository->getUrl(''),
            'requireWorker' => $this->assetRepository->getUrl('VMPL_BugReplay::js/worker/requirejs-plugin.js'),
            'requirejs' => $this->assetRepository->getUrl('requirejs/require.js'),
            'requireMixins' => $this->assetRepository->getUrl('mage/requirejs/mixins.js'),
            'requireConfig' => $this->assetRepository->getUrl('requirejs-config.js'),
        ]);
        $htmlScript = $block->toHtml();

        $resultRaw = $this->resultFactory->create(ResultFactory::TYPE_RAW);
        $resultRaw->setHeader('Content-Type', 'application/javascript');
        $resultRaw->setContents($htmlScript);
        return $resultRaw;
    }

    protected function getWorkerFile()
    {
        $workerFile = [];
        foreach ($this->request->getParams() as $key => $value) {
            $workerFile[] = "{$key}/{$value}";
        }
        return trim(implode("/", $workerFile), '/');
    }
}
