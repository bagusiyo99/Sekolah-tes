package com.sekolah.services.Blog;

import com.sekolah.dto.ArticleDTO;

import java.io.IOException;
import java.util.List;

public interface BlogService {
    boolean postArticle(Long userId, ArticleDTO articleDTO) throws IOException;
    List<ArticleDTO> getAllArticles(Long userId);

    ArticleDTO getArticleById(Long articleId) ;

     boolean updateArticle(Long articleId, ArticleDTO articleDTO) throws IOException ;

    boolean deleteArticle(Long articleId) ;
    List<ArticleDTO> searchArticleByTitle (String title);

}
