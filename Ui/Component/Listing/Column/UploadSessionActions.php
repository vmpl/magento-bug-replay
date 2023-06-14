<?php declare(strict_types=1);

namespace VMPL\BugReplay\Ui\Component\Listing\Column;

class UploadSessionActions extends \Magento\Ui\Component\Listing\Columns\Column
{
    public function __construct(
        \Magento\Framework\View\Element\UiComponent\ContextInterface   $context,
        \Magento\Framework\View\Element\UiComponentFactory $uiComponentFactory,
        protected readonly \Magento\Framework\UrlInterface $urlBuilder,
        array              $components = [],
        array              $data = []
    ) {
        parent::__construct(
            $context,
            $uiComponentFactory,
            $components,
            $data
        );
    }

    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as &$item) {
                $name = $this->getData('name');
                if (isset($item['hash'])) {
                    $href = $this->urlBuilder->getUrl(
                        'vmpl_bug_replay/session/view',
                        ['id' => $item['hash']],
                    );

                    $item[$name]['view'] = [
                        'href' => $href,
                        'label' => __('View'),
                    ];
                }
            }
        }

        return $dataSource;
    }
}
